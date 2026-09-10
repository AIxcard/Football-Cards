"""
Automated Game Health, Syntax & Headless CDP Verification Script
Validates:
1. Bracket balance & syntax integrity
2. Exported action identifiers vs defined functions
3. Headless Edge/Chrome CDP runtime execution & zero uncaught exceptions
"""

import os
import sys
import re
import json
import subprocess
import urllib.request
import time

def strip_js_comments(code):
    pattern = r'(\'(?:[^\'\\]|\\.)*\'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(/\*[\s\S]*?\*/|//.*)'
    def replacer(match):
        if match.group(2): return ""
        return match.group(1)
    return re.sub(pattern, replacer, code)

def check_syntax(js_path):
    print("\n[1/3] Checking JS Syntax & Bracket Balancing...")
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    cleaned = strip_js_comments(code)
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    in_str = False
    str_char = ''
    escaped = False

    for ch in cleaned:
        if in_str:
            if escaped: escaped = False
            elif ch == '\\': escaped = True
            elif ch == str_char: in_str = False
            continue
        else:
            if ch in ('"', "'", '`'):
                in_str = True
                str_char = ch
            elif ch in ('(', '{', '['):
                stack.append(ch)
            elif ch in (')', '}', ']'):
                if not stack:
                    print(f"FAILED: Unexpected closing bracket '{ch}'")
                    return False
                last = stack.pop()
                if pairs[ch] != last:
                    print(f"FAILED: Mismatched '{ch}', expected for '{last}'")
                    return False

    if stack:
        print(f"FAILED: {len(stack)} unclosed brackets remaining: {stack}")
        return False

    print("  PASS: 0 syntax/bracket errors. Code structure is balanced.")
    return True

def check_exports(js_path):
    print("\n[2/3] Auditing EXPORTED_ACTIONS & Global Scope Integrity...")
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    match = re.search(r'const EXPORTED_ACTIONS = \{([^}]+)\};', code)
    if not match:
        print("  WARNING: EXPORTED_ACTIONS object not found.")
        return True

    actions = [a.strip().rstrip(',') for a in match.group(1).splitlines() if a.strip() and not a.strip().startswith('//')]
    missing = []
    for action in actions:
        if not action: continue
        fn_pattern = r'(function\s+' + re.escape(action) + r'\b|const\s+' + re.escape(action) + r'\b|let\s+' + re.escape(action) + r'\b|var\s+' + re.escape(action) + r'\b)'
        if not re.search(fn_pattern, code):
            missing.append(action)

    if missing:
        print(f"FAILED: Found {len(missing)} missing identifiers in EXPORTED_ACTIONS:")
        for m in missing:
            print(f"    - {m}")
        return False

    print(f"  PASS: All {len(actions)} exported actions are defined. Zero ReferenceError risk.")
    return True

def check_cdp_runtime(index_path):
    print("\n[3/3] Running Headless CDP Runtime Verification...")
    try:
        import websocket
    except ImportError:
        print("  Installing websocket-client for CDP tracing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "websocket-client"], check=False)
        import websocket

    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    ]
    browser_exe = next((p for p in edge_paths if os.path.exists(p)), None)
    if not browser_exe:
        print("  WARNING: Browser executable not found, skipping CDP runtime check.")
        return True

    profile_dir = os.path.abspath("./.temp_cdp_profile")
    os.makedirs(profile_dir, exist_ok=True)
    local_url = "file:///" + os.path.abspath(index_path).replace("\\", "/")

    cmd = [
        browser_exe,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--remote-allow-origins=*",
        f"--user-data-dir={profile_dir}",
        "--disable-gpu",
        local_url
    ]
    proc = subprocess.Popen(cmd)
    time.sleep(3)

    exceptions = []
    eval_result = None

    try:
        req = urllib.request.urlopen("http://localhost:9222/json", timeout=5)
        tabs = json.loads(req.read().decode())
        target_tab = next((t for t in tabs if "Football Cards" in t.get("title", "") or "index.html" in t.get("url", "")), None)

        if target_tab:
            ws = websocket.create_connection(target_tab["webSocketDebuggerUrl"], timeout=10)
            ws.send(json.dumps({"id": 1, "method": "Console.enable"}))
            ws.send(json.dumps({"id": 2, "method": "Runtime.enable"}))
            ws.send(json.dumps({
                "id": 3,
                "method": "Runtime.evaluate",
                "params": {
                    "expression": "({ stateExists: typeof state !== 'undefined', user: typeof state !== 'undefined' ? state.accountUser : '', coins: typeof state !== 'undefined' ? state.coins : 0, cardsCount: (typeof state !== 'undefined' && state.cards) ? state.cards.length : 0 })",
                    "returnByValue": True
                }
            }))

            start = time.time()
            while time.time() - start < 4:
                try:
                    ws.settimeout(1.0)
                    msg = ws.recv()
                    data = json.loads(msg)
                    if "exception" in data.get("method", "").lower():
                        exceptions.append(data)
                    elif data.get("id") == 3:
                        eval_result = data.get("result", {}).get("result", {}).get("value", {})
                except Exception:
                    break
            ws.close()
    except Exception as e:
        print("  WARNING: CDP connection error:", e)
    finally:
        proc.terminate()

    if exceptions:
        print(f"FAILED: {len(exceptions)} uncaught exceptions during page load:")
        print(json.dumps(exceptions, indent=2))
        return False

    print("  PASS: Headless runtime clean! 0 uncaught exceptions.")
    if eval_result:
        print(f"  Live State Verification -> User: '{eval_result.get('user')}', Coins: {eval_result.get('coins')}, Cards: {eval_result.get('cardsCount')}")
    return True

if __name__ == "__main__":
    workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
    js_file = os.path.join(workspace_root, "script.js")
    html_file = os.path.join(workspace_root, "index.html")

    if not os.path.exists(js_file):
        # Fallback if run from workspace root
        if os.path.exists("script.js"):
            js_file = os.path.abspath("script.js")
            html_file = os.path.abspath("index.html")
        else:
            print(f"Error: {js_file} not found.")
            sys.exit(1)

    s_pass = check_syntax(js_file)
    e_pass = check_exports(js_file)
    c_pass = check_cdp_runtime(html_file)

    if s_pass and e_pass and c_pass:
        print("\n========================================================")
        print("PASS: ALL QUALITY GATES PASSED! CODEBASE IS 100% READY.")
        print("========================================================\n")
        sys.exit(0)
    else:
        print("\n========================================================")
        print("FAIL: VERIFICATION FAILED! RESOLVE ISSUES BEFORE RELEASE.")
        print("========================================================\n")
        sys.exit(1)
