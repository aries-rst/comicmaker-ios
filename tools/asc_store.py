"""Fills the App Store Connect card of Comics Maker via API: name/subtitle/description (EN + RU),
categories, age rating, review notes and iPhone 6.5" screenshots. Run: Actions → "Store card" → Run workflow.
The app record must already exist in App Store Connect (created by hand)."""
import os, time, json, hashlib, glob, re, jwt, requests
KID = os.environ["ASC_KEY_ID"]; ISS = os.environ["ASC_ISSUER_ID"]; KEY = os.environ["ASC_KEY"]
BUNDLE = "com.aries-rst.comicmaker.app"; B = "https://api.appstoreconnect.apple.com"
PRIV = "https://claude.ai/artifact/UDf2ks9Dh8YXW2TC39TuuK"; SITE = "https://aresti-labs.web.app"
def H():
    t = jwt.encode({"iss": ISS, "iat": int(time.time()), "exp": int(time.time()) + 900, "aud": "appstoreconnect-v1"}, KEY, algorithm="ES256", headers={"kid": KID})
    return {"Authorization": "Bearer " + t, "Content-Type": "application/json"}
def call(m, p, body=None, ok=(200, 201, 204)):
    r = requests.request(m, B + p, headers=H(), data=json.dumps(body) if body else None)
    if r.status_code not in ok: print("ERR", m, p, r.status_code, r.text[:500]); return {}
    return r.json() if r.text else {}

EN = dict(name="Comics Maker: Story Creator", sub="Make comics, stories & tales",
 promo="Make a comic for a school project in minutes: 40 ready-made stories, full fairy tales, dozens of characters and outfits.",
 kw="comic,comics,maker,creator,story,cartoon,school,kids,strip,manga,speech bubble,fairy tale,drawing",
 desc="""Need a comic for a school project, or just want to tell a funny story? Comics Maker helps you make one in minutes — no drawing skills needed.

40 READY-MADE STORIES
A hike in the mountains, a trip to the river, the museum, the doctor, the pharmacy, the first day at school, holidays and more. Every story spans several pages. Open one, make your own copy and change anything.

FULL FAIRY TALES
"The Fisherman and the Golden Fish" in 6 pages: the sea changes from calm to storm as the old woman turns from peasant to queen.

CHARACTERS FOR EVERY STORY
Dozens of characters of different nations and ages. Poses, emotions, head turn, build, height and shoes.

DOZENS OF OUTFITS
Doctors, chefs, builders, miners, firefighters, pilots, sailors and astronauts. Historical costumes: knights, Vikings, pirates, Romans, Egyptians, kings and queens. Traditional clothing and headwear from many countries.

HUNDREDS OF PROPS
Tools, kitchenware, home appliances, books and scrolls, garden beds, animals and vehicles. Dozens of backgrounds: school, city, nature, sea, palace.

BUBBLES AND TEXT
Speech, thought, shout, whisper and captions. Word highlighting, a second tail and sound effects.

PAGES AND EXPORT
A cover, multiple pages, your own panel layouts and your own photos. Save to Photos as PNG or JPG, the whole comic as PDF, or make a 9:16 story image and share it.

MORE
Theme of the day with a story idea, 7 color themes, a built-in guide, undo and autosave. The editor works without internet. English, Russian and Uzbek.""")
RU = dict(name="Комиксы: конструктор историй", sub="Комиксы, истории и сказки",
 promo="Комикс для школьного задания за несколько минут: 40 готовых историй, сказки целиком, десятки героев и нарядов.",
 kw="комикс,комиксы,конструктор,история,мультик,школа,дети,сказка,рисовать,облачко,манга,персонажи",
 desc="""Хотите сделать комикс для школьного задания или просто нарисовать смешную историю? Комикс-конструктор поможет за несколько минут, даже если вы не умеете рисовать.

40 ГОТОВЫХ ИСТОРИЙ
Поход в горы, к реке, в музей, к врачу, в аптеку, первый день в школе, праздники и многое другое. Каждая история на нескольких страницах. Откройте любую, сделайте свою копию и меняйте как хотите.

СКАЗКИ ЦЕЛИКОМ
«Сказка о рыбаке и рыбке» на 6 страницах: море меняется от спокойного до бури, старуха превращается из крестьянки в царицу.

ГЕРОИ НА ЛЮБОЙ ВКУС
Десятки персонажей разных народов и возрастов. Позы, эмоции, поворот головы, телосложение, рост, обувь.

ДЕСЯТКИ НАРЯДОВ
Врачи, повара, строители, шахтёры, пожарные, лётчики, моряки, космонавты. Исторические костюмы: рыцари, викинги, пираты, римляне, египтяне, цари и царицы. Национальная одежда разных стран и головные уборы.

СОТНИ ПРЕДМЕТОВ
Инструменты, посуда, бытовая техника, книги и свитки, сад и огород, животные, транспорт. Десятки фонов: школа, город, природа, море, дворец.

ПУЗЫРИ И ТЕКСТ
Речь, мысль, крик, шёпот, плашка автора. Выделение слов, второй хвостик, звуковые эффекты.

СТРАНИЦЫ И ЭКСПОРТ
Обложка, много страниц, своя раскладка кадров, свои фото. Сохранение в «Фото» в PNG и JPG, весь комикс в PDF и картинка для сторис 9:16.

ЕЩЁ
Тема дня с идеей для истории, 7 цветовых тем, инструкция внутри приложения, отмена действий и автосохранение. Редактор работает без интернета. Русский, английский и узбекский языки.""")
NOTES = """Comics Maker is a free, offline comic-strip editor for school students (13+) and their teachers. Users build comic pages from ready-made characters, outfits, props, backgrounds and speech bubbles, then save the result to Photos (PNG/JPG), to Files (multi-page PDF) or share it. Value: a child can make a comic for a school assignment without drawing skills.

HOW TO USE (no account, no login, no demo credentials needed; everything works offline):
1. Launch, choose a language (English / Русский / O'zbek).
2. Tap "New comic" and open any ready-made story (e.g. "The Fisherman and the Golden Fish"), then "Make my own comic" and enter a title — or pick an empty page layout.
3. Tap a panel to edit it: "+" adds a character, speech bubble, object, animal, food or your own photo. Tap a character to change pose, emotion, outfit, headwear, shoes, body.
4. Back on the page: "Save" (Photos / PDF to Files) or "Share" (system share sheet).
5. Home screen: "Color theme", "How to use" (built-in guide), "Theme of the day".

PERMISSIONS: Photos add-only (save pages), Photos/Camera only when the user adds their own picture to a panel.
EXTERNAL SERVICES: Google AdMob SDK is included but ads are DISABLED in this version. No servers, no analytics, no user accounts, no chat, no content leaves the device unless the user shares it. No in-app purchases.
REGIONAL DIFFERENCES: none. REGULATED / THIRD-PARTY MATERIAL: none — all artwork is original or CC0 (Open Peeps). "The Fisherman and the Golden Fish" is A. Pushkin's 1833 public-domain tale, retold."""

app = [a for a in call("GET", f"/v1/apps?filter[bundleId]={BUNDLE}")["data"] if a["attributes"]["bundleId"] == BUNDLE]
if not app: raise SystemExit("App record not found in App Store Connect — create it first")
APP = app[0]["id"]; print("app", APP)
call("PATCH", f"/v1/apps/{APP}", {"data": {"type": "apps", "id": APP, "attributes": {"contentRightsDeclaration": "DOES_NOT_USE_THIRD_PARTY_CONTENT"}}}); print("content rights ok")
ai = call("GET", f"/v1/apps/{APP}/appInfos")["data"]
info = ([a for a in ai if a["attributes"].get("appStoreState") in ("PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED", "METADATA_REJECTED")] or ai)[0]["id"]
call("PATCH", f"/v1/appInfos/{info}", {"data": {"type": "appInfos", "id": info, "relationships": {
    "primaryCategory": {"data": {"type": "appCategories", "id": "GRAPHICS_AND_DESIGN"}},
    "secondaryCategory": {"data": {"type": "appCategories", "id": "EDUCATION"}}}}})
ls = {l["attributes"]["locale"]: l["id"] for l in call("GET", f"/v1/appInfos/{info}/appInfoLocalizations")["data"]}
for loc, t in (("en-US", EN), ("ru", RU)):
    at = {"name": t["name"], "subtitle": t["sub"], "privacyPolicyUrl": PRIV}
    if loc in ls: call("PATCH", f"/v1/appInfoLocalizations/{ls[loc]}", {"data": {"type": "appInfoLocalizations", "id": ls[loc], "attributes": at}})
    else: call("POST", "/v1/appInfoLocalizations", {"data": {"type": "appInfoLocalizations", "attributes": dict(at, locale=loc), "relationships": {"appInfo": {"data": {"type": "appInfos", "id": info}}}}})
vs = call("GET", f"/v1/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=5")["data"]
v = [x for x in vs if x["attributes"]["appStoreState"] in ("PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED", "METADATA_REJECTED")][0]["id"]
call("PATCH", f"/v1/appStoreVersions/{v}", {"data": {"type": "appStoreVersions", "id": v, "attributes": {"copyright": "2026 Rustamjon Suvanqulov"}}})
vl = {l["attributes"]["locale"]: l["id"] for l in call("GET", f"/v1/appStoreVersions/{v}/appStoreVersionLocalizations")["data"]}
for loc, t in (("en-US", EN), ("ru", RU)):
    at = {"description": t["desc"], "keywords": t["kw"], "promotionalText": t["promo"], "supportUrl": SITE, "marketingUrl": SITE}
    if loc in vl: call("PATCH", f"/v1/appStoreVersionLocalizations/{vl[loc]}", {"data": {"type": "appStoreVersionLocalizations", "id": vl[loc], "attributes": at}})
    else: vl[loc] = call("POST", "/v1/appStoreVersionLocalizations", {"data": {"type": "appStoreVersionLocalizations", "attributes": dict(at, locale=loc), "relationships": {"appStoreVersion": {"data": {"type": "appStoreVersions", "id": v}}}}})["data"]["id"]
# age rating: cartoon props incl. swords/cannons → mild cartoon violence
ar = call("GET", f"/v1/appInfos/{info}/ageRatingDeclaration").get("data")
if ar:
    at = {k: "NONE" for k in ["alcoholTobaccoOrDrugUseOrReferences", "contests", "gamblingSimulated", "horrorOrFearThemes", "matureOrSuggestiveThemes", "medicalOrTreatmentInformation", "profanityOrCrudeHumor", "sexualContentGraphicAndNudity", "sexualContentOrNudity", "violenceRealistic", "violenceRealisticProlongedGraphicOrSadistic"]}
    at.update(violenceCartoonOrFantasy="INFREQUENT_OR_MILD", gunsOrOtherWeapons="INFREQUENT_OR_MILD", gambling=False, unrestrictedWebAccess=False, lootBox=False,
              advertising=False, healthOrWellnessTopics=False, messagingAndChat=False, parentalControls=False, userGeneratedContent=False, socialMedia=False, ageAssurance=False)
    for _ in range(25):
        r = requests.patch(B + f"/v1/ageRatingDeclarations/{ar['id']}", headers=H(), data=json.dumps({"data": {"type": "ageRatingDeclarations", "id": ar["id"], "attributes": at}}))
        if r.status_code < 300: print("age ok"); break
        print("age retry", r.status_code, r.text[:300])
        u = re.search(r"Unknown attribute '?(\w+)", r.text); q = re.search(r"attribute '(\w+)' with this request", r.text)
        if u and u.group(1) in at: del at[u.group(1)]
        elif q: at[q.group(1)] = False
        elif "Expected a" in r.text and (t := re.search(r"attribute '(\w+)'", r.text)): at[t.group(1)] = "NONE"
        else: break
# review notes
rd = call("GET", f"/v1/appStoreVersions/{v}/appStoreReviewDetail").get("data")
phone = None
for other in call("GET", "/v1/apps?limit=50")["data"]:          # reuse the contact phone of the developer's other apps
    for ov in call("GET", f"/v1/apps/{other['id']}/appStoreVersions?limit=3").get("data", []):
        d = call("GET", f"/v1/appStoreVersions/{ov['id']}/appStoreReviewDetail").get("data")
        if d and d["attributes"].get("contactPhone"): phone = d["attributes"]["contactPhone"]; break
    if phone: break
att = {"notes": NOTES, "demoAccountRequired": False, "contactEmail": "games.dev4u@gmail.com", "contactFirstName": "Rustamjon", "contactLastName": "Suvanqulov"}
if phone: att["contactPhone"] = phone
if rd: call("PATCH", f"/v1/appStoreReviewDetails/{rd['id']}", {"data": {"type": "appStoreReviewDetails", "id": rd["id"], "attributes": att}})
else: call("POST", "/v1/appStoreReviewDetails", {"data": {"type": "appStoreReviewDetails", "attributes": att, "relationships": {"appStoreVersion": {"data": {"type": "appStoreVersions", "id": v}}}}})
# screenshots (iPhone 6.5")
def upload(create_body, f):
    data = open(f, "rb").read(); r = call("POST", "/v1/appScreenshots", create_body(os.path.basename(f), len(data)))["data"]
    for op in r["attributes"]["uploadOperations"]:
        requests.put(op["url"], headers={h["name"]: h["value"] for h in op["requestHeaders"]}, data=data[op["offset"]:op["offset"] + op["length"]]).raise_for_status()
    call("PATCH", f"/v1/appScreenshots/{r['id']}", {"data": {"type": "appScreenshots", "id": r["id"], "attributes": {"uploaded": True, "sourceFileChecksum": hashlib.md5(data).hexdigest()}}})
for loc, pre in (("en-US", "en"), ("ru", "ru")):
    sets = call("GET", f"/v1/appStoreVersionLocalizations/{vl[loc]}/appScreenshotSets")["data"]
    st = next((s["id"] for s in sets if s["attributes"]["screenshotDisplayType"] == "APP_IPHONE_65"), None)
    if not st: st = call("POST", "/v1/appScreenshotSets", {"data": {"type": "appScreenshotSets", "attributes": {"screenshotDisplayType": "APP_IPHONE_65"}, "relationships": {"appStoreVersionLocalization": {"data": {"type": "appStoreVersionLocalizations", "id": vl[loc]}}}}})["data"]["id"]
    for s in call("GET", f"/v1/appScreenshotSets/{st}/appScreenshots")["data"]: call("DELETE", f"/v1/appScreenshots/{s['id']}")
    for f in sorted(glob.glob(f"store/{pre}_*.png")):
        upload(lambda n, s: {"data": {"type": "appScreenshots", "attributes": {"fileName": n, "fileSize": s}, "relationships": {"appScreenshotSet": {"data": {"type": "appScreenshotSets", "id": st}}}}}, f); print("shot", f)
# attach the newest processed build
bs = call("GET", f"/v1/builds?filter[app]={APP}&sort=-uploadedDate&limit=3")["data"]
okb = [b for b in bs if b["attributes"]["processingState"] == "VALID"]
if okb: call("PATCH", f"/v1/appStoreVersions/{v}/relationships/build", {"data": {"type": "builds", "id": okb[0]["id"]}}); print("build", okb[0]["attributes"]["version"])
print("DONE")
