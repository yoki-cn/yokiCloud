---
kind: algorithm
title: 模 $p^k$ 阶乘与组合数
updated: 2026-10-12
status: draft
order: 1051600
tags:
  - 数论
---

Legendre：


$$
v_p(n!)=\sum_{j\ge1}\lfloor n/p^j\rfloor,\quad v_p\left(\binom nk\right)=v_p(n!)-v_p(k!)-v_p((n-k)!).
$$


将 $n!$ 中所有 $p$ 因子提出，得到 $n!=p^{v_p(n!)}U_p(n)$（$p\nmid U_p(n)$）。模 $p^e$ 组合数可先求指数 $v=v_p(\binom nk)$：若 $v\ge e$ 则结果为 $0$，否则


$$
\binom nk\equiv p^v U_p(n)U_p(k)^{-1}U_p(n-k)^{-1}\pmod{p^e}.
$$


式中逆元存在，计算 $U_p(n)$ 可通过去 $p$ 阶乘的周期分块。模任意合数先分解素数幂分别求解，再 exCRT。
