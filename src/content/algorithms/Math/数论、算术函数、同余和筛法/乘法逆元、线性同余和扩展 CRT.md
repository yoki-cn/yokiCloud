---
kind: algorithm
title: 乘法逆元、线性同余和扩展 CRT
updated: 2026-10-12
status: draft
order: 1050700
tags:
  - 数论
---

$a^{-1}\pmod m$ 存在当且仅当 $\gcd(a,m)=1$，即扩欧求 $ax+my=1$ 的 $x$。


$$
ax\equiv b\pmod m\text{ 可解}\iff d=\gcd(a,m)\mid b.
$$


若可解，有 $d$ 个模 $m$ 的解，由 $x\equiv(a/d)^{-1}(b/d)\pmod{m/d}$ 给出模 $m/d$ 的基类。

**CRT（模数两两互质）**：$x\equiv a_i\pmod{m_i}$，令 $M=\prod m_i$、$M_i=M/m_i$，则


$$
x\equiv\sum_i a_i M_i(M_i^{-1}\bmod m_i)\pmod M.
$$


**exCRT 合并两式**：$x\equiv a\pmod m$，$x\equiv b\pmod n$ 当且仅当


$$
\gcd(m,n)\mid(b-a).
$$


令 $d=\gcd(m,n)$、$t\equiv\frac{b-a}{d}\left(\frac md\right)^{-1}\pmod{n/d}$，则


$$
x\equiv a+mt\pmod{\operatorname{lcm}(m,n)}.
$$


模 $1$ 可表示无约束；用整型实现时需防止 $M$ 或 $mt$ 溢出。
