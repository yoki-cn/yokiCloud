---
kind: algorithm
title: Harmonic 数与调和求和
updated: 2026-10-12
status: draft
order: 1090200
tags:
  - 组合数学
  - 特殊数列
---

$$
H_n=\sum_{k=1}^n\frac1k,\quad H_n^{(r)}=\sum_{k=1}^n\frac1{k^r},\quad H_0=0.
$$


$$
\sum_{k=1}^nH_k=(n+1)H_n-n,
$$


$$
\sum_{k=1}^nkH_k=\frac{n(n+1)}2H_n-\frac{n(n-1)}4,
$$


$$
\sum_{k=1}^n\frac{H_k}{k}=\frac12\bigl(H_n^2+H_n^{(2)}\bigr),
$$


$$
\sum_{k=0}^n\binom kmH_k=\binom{n+1}{m+1}\left(H_{n+1}-\frac1{m+1}\right)\quad(0\le m\le n).
$$


$H_n=\log n+\gamma+1/(2n)-1/(12n^2)+O(n^{-4})$，这里 $n\to\infty$，$\gamma$ 是 Euler–Mascheroni 常数；渐近式不能当有限 $n$ 的严格等式。
