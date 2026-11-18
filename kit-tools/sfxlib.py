"""Synthesis + leveling helpers for the clean UI sound effects (no side effects on import)."""
import json
import re

import numpy as np

SR = 48000
rng = np.random.default_rng(11)


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(d, attack, tau):
    t = t_(d)
    return np.clip(t / max(attack, 1e-4), 0, 1) * np.exp(-t / tau)


def band_noise(d, lo, hi):
    n = int(d * SR)
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.exp(-0.5 * (np.log2(np.maximum(f, 1) / np.sqrt(lo * hi)) / (np.log2(hi / lo) / 2.2)) ** 2)
    y = np.fft.irfft(spec * g, n)
    return y / (np.abs(y).max() + 1e-9)


def sine(d, f, glide_to=None, gtau=0.05):
    t = t_(d)
    if glide_to is None:
        return np.sin(2 * np.pi * f * t)
    fr = glide_to + (f - glide_to) * np.exp(-t / gtau)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR)


def click():
    d = 0.06
    y = band_noise(d, 2200, 7000) * env(d, 0.0005, 0.004) * 0.9 + sine(d, 190) * env(d, 0.001, 0.010) * 0.55
    k = int(0.028 * SR)
    y[k:] += (band_noise(d, 2500, 7000) * env(d, 0.0005, 0.003))[: len(y) - k] * 0.35
    return y


def key():
    d = 0.03
    lo = rng.uniform(1300, 1900)
    return band_noise(d, lo, lo * 3.2) * env(d, 0.0004, rng.uniform(0.0035, 0.006)) * rng.uniform(0.7, 1.0)


def tick(f=2600):
    d = 0.05
    return sine(d, f) * env(d, 0.0008, 0.011) + band_noise(d, f * 0.8, f * 2) * env(d, 0.0003, 0.002) * 0.25


def tock(f=760):
    d = 0.16
    return sine(d, f) * env(d, 0.0015, 0.040) + 0.32 * sine(d, f * 2.76) * env(d, 0.001, 0.018)


def pop(f0=980, f1=560):
    d = 0.14
    return sine(d, f0, glide_to=f1, gtau=0.03) * env(d, 0.002, 0.040) + 0.15 * sine(d, 2 * f0, glide_to=2 * f1, gtau=0.03) * env(d, 0.002, 0.02)


def chime(notes=(1318.5, 1975.5)):
    d = 1.2
    y = np.zeros(int(d * SR))
    for i, f in enumerate(notes):
        k = int(i * 0.075 * SR)
        s = (sine(d, f) + 0.18 * sine(d, 2 * f) + 0.06 * sine(d, 3 * f)) * env(d, 0.004, 0.32)
        y[k:] += s[: len(y) - k] * (1 if i == 0 else 0.8)
    return y


def absent():
    d = 0.42
    y = np.pad(tock(392), (0, int(d * SR) - int(0.16 * SR)))
    k = int(0.12 * SR)
    t2 = tock(294)
    y[k:k + len(t2)] += t2 * 0.85
    return y


def whoosh(d=0.75, f_from=380, f_to=3200, peak=0.6, width=0.55):
    n = int(d * SR)
    x = rng.standard_normal(n + 2048)
    N, H = 1024, 256
    win = np.hanning(N)
    out = np.zeros(n + 2048)
    f = np.fft.rfftfreq(N, 1 / SR)
    frames = (n + 2048 - N) // H
    for i in range(frames):
        p = i / max(1, frames - 1)
        fc = f_from * (f_to / f_from) ** p
        g = np.exp(-0.5 * (np.log2(np.maximum(f, 1) / fc) / width) ** 2)
        out[i * H:i * H + N] += np.fft.irfft(np.fft.rfft(x[i * H:i * H + N] * win) * g, N) * win
    out = out[:n]
    t = np.linspace(0, 1, n)
    e = np.where(t < peak, np.sin(np.pi / 2 * t / peak) ** 2, np.cos(np.pi / 2 * (t - peak) / (1 - peak)) ** 2)
    return out * e


def swish():
    return whoosh(0.26, 1200, 5200, 0.7, 0.6)


def swish_out():
    return whoosh(0.32, 4200, 900, 0.35, 0.6)


def impact():
    d = 0.7
    y = sine(d, 78, glide_to=46, gtau=0.12) * env(d, 0.003, 0.22)
    y += band_noise(d, 120, 600) * env(d, 0.001, 0.03) * 0.35
    return y


def toggle():  # switch flipping off: two short descending ticks
    return np.concatenate([tick(1500), np.zeros(int(0.03 * SR)), tick(1100)])


def kweight(sig):
    n = len(sig)
    f = np.maximum(np.fft.rfftfreq(n, 1 / SR), 1e-3)
    hp = f ** 2 / (f ** 2 + 38.0 ** 2)
    shelf = 1 + (10 ** (4 / 20) - 1) / (1 + (1681.0 / f) ** 2)
    return np.fft.irfft(np.fft.rfft(sig) * hp * shelf, n)


def active_rms_db(sig):
    sig = kweight(sig)
    hop = int(0.01 * SR)
    fr = np.array([np.sqrt(np.mean(sig[i:i + hop] ** 2) + 1e-12) for i in range(0, max(1, len(sig) - hop), hop)])
    db = 20 * np.log10(fr)
    act = fr[db > db.max() - 12]
    return 20 * np.log10(np.sqrt(np.mean(act ** 2)))


REL = {"transição": -7, "swish": -9, "saída": -12, "clique": -5, "tecla": -11, "letra": -13, "tique": -8,
       "toc": -7, "pop": -7, "sino": -9, "ausente": -7, "impacto": -6}


class Anchors:
    def __init__(self, timeline_path):
        tl = json.load(open(timeline_path, encoding="utf-8"))
        self.norm = lambda s: re.sub(r'[.,!?:;"“”]', "", s.lower())
        self.W = [dict(w, n=self.norm(w["text"])) for w in tl["words"]]
        self.SC = tl["scenes"]
        self.duration = tl["duration"]

    def at(self, scene, phrase, nth=0):
        p = [self.norm(x) for x in phrase.split()]
        c = 0
        for i, w in enumerate(self.W):
            if w["scene"] != scene:
                continue
            if all(i + j < len(self.W) and self.W[i + j]["n"] == p[j] for j in range(len(p))):
                if c == nth:
                    return w["start"]
                c += 1
        raise KeyError(f"{scene} {phrase}")

    def end_of(self, scene, phrase):
        s = self.at(scene, phrase)
        i = next(k for k, w in enumerate(self.W) if w["scene"] == scene and w["start"] == s)
        return self.W[i + len(phrase.split()) - 1]["end"]
