"""Build subtitle cues (max 2 lines) from the narration timeline.

usage: python -I subs.py timeline.json out_subs.json
"""
import json
import re
import sys

tl = json.load(open(sys.argv[1], encoding="utf-8"))
W = tl["words"]

# spoken -> written (numbers, brand), applied to word sequences
REPL = [
    (["Agência", "Mídia"], "Agência Exemplo"),
    (["quatro", "minutos"], "4 minutos"),
    (["quatro", "vírgula", "oito"], "4,8"),
    (["quarenta", "e", "duas"], "42"),
    (["trinta", "e", "cinco"], "35"),
    (["seis", "de", "novembro"], "6 de novembro"),
    (["nove", "às", "seis"], "9h às 18h"),
    (["quinze", "minutos"], "15 minutos"),
]


def norm(s):
    return re.sub(r"[^\wÀ-ÿ]", "", s).lower()


toks, i = [], 0
while i < len(W):
    hit = None
    for src, dst in REPL:
        n = len(src)
        if [norm(w["text"]) for w in W[i:i + n]] == [norm(x) for x in src]:
            tail = re.sub(r"^[\wÀ-ÿ]+", "", W[i + n - 1]["text"])  # keep trailing punctuation
            hit = dict(text=dst + tail, start=W[i]["start"], end=W[i + n - 1]["end"], scene=W[i]["scene"])
            i += n
            break
    if not hit:
        hit = dict(W[i])
        i += 1
    toks.append(hit)

MAXC = 64
cues, cur = [], []


def flush():
    if cur:
        cues.append(dict(text=" ".join(t["text"] for t in cur), start=cur[0]["start"], end=cur[-1]["end"],
                         scene=cur[0]["scene"]))
        cur.clear()


for t in toks:
    if cur and (t["scene"] != cur[0]["scene"] or len(" ".join(x["text"] for x in cur)) + 1 + len(t["text"]) > MAXC):
        # prefer breaking after a comma if the cue is long enough
        flush()
    cur.append(t)
    txt = " ".join(x["text"] for x in cur)
    if t["text"][-1] in ".?!" or (t["text"][-1] in ",:" and len(txt) > 38):
        flush()
flush()

# cue stays until the next one starts (no flicker), but at most +0.6 s after its last word
for a, b in zip(cues, cues[1:]):
    a["end"] = round(min(b["start"], a["end"] + 0.6) if b["start"] - a["end"] < 0.6 else a["end"] + 0.4, 3)
cues[-1]["end"] = round(cues[-1]["end"] + 1.2, 3)
json.dump(cues, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(cues), "cues; longest", max(len(c["text"]) for c in cues))
for c in cues[:6]:
    print(round(c["start"], 2), c["text"])
print("dash:", any("—" in c["text"] or " - " in c["text"] for c in cues))
