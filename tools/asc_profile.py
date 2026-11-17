"""Gets (or creates) the App Store provisioning profile for this app via the App Store Connect API
and installs it, so no profile has to be downloaded/base64-encoded by hand.
Uses the same ASC API key as the TestFlight upload. Falls back silently if the key lacks rights
(then the BUILD_PROVISION_PROFILE_BASE64 secret is used instead)."""
import os, sys, time, json, base64, pathlib, jwt, requests
KID = os.environ["ASC_KEY_ID"]; ISS = os.environ["ASC_ISSUER_ID"]; KEY = os.environ.get("ASC_KEY", "")
BUNDLE = os.environ["BUNDLE_ID"]; NAME = os.environ["PROFILE_NAME"]; B = "https://api.appstoreconnect.apple.com"
if not KEY:
    print("no ASC key"); sys.exit(1)
def H():
    t = jwt.encode({"iss": ISS, "iat": int(time.time()), "exp": int(time.time()) + 900, "aud": "appstoreconnect-v1"}, KEY, algorithm="ES256", headers={"kid": KID})
    return {"Authorization": "Bearer " + t, "Content-Type": "application/json"}
def call(m, p, body=None):
    r = requests.request(m, B + p, headers=H(), data=json.dumps(body) if body else None)
    if r.status_code >= 300:
        print("ERR", m, p, r.status_code, r.text[:400]); sys.exit(1)
    return r.json()
bid = [x for x in call("GET", f"/v1/bundleIds?filter[identifier]={BUNDLE}&limit=50")["data"] if x["attributes"]["identifier"] == BUNDLE]
if not bid:
    print("bundle id not registered:", BUNDLE); sys.exit(1)
bid = bid[0]["id"]
prof = [p for p in call("GET", f"/v1/profiles?filter[name]={requests.utils.quote(NAME)}&limit=50")["data"]
        if p["attributes"]["name"] == NAME and p["attributes"]["profileState"] == "ACTIVE"]
if prof:
    content = prof[0]["attributes"]["profileContent"]; print("using existing profile", NAME)
else:
    certs = []
    for t in ("DISTRIBUTION", "IOS_DISTRIBUTION"):
        certs += [c["id"] for c in call("GET", f"/v1/certificates?filter[certificateType]={t}&limit=50")["data"]]
    if not certs:
        print("no distribution certificate"); sys.exit(1)
    body = {"data": {"type": "profiles", "attributes": {"name": NAME, "profileType": "IOS_APP_STORE"},
            "relationships": {"bundleId": {"data": {"type": "bundleIds", "id": bid}},
                              "certificates": {"data": [{"type": "certificates", "id": c} for c in certs]}}}}
    content = call("POST", "/v1/profiles", body)["data"]["attributes"]["profileContent"]; print("created profile", NAME)
d = pathlib.Path.home() / "Library/MobileDevice/Provisioning Profiles"; d.mkdir(parents=True, exist_ok=True)
(d / "comicmaker.mobileprovision").write_bytes(base64.b64decode(content))
print("installed")
