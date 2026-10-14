---
kind: algorithm
title: Jordan 函数与带权 gcd 求和
updated: 2026-10-12
status: draft
order: 1052300
tags:
  - 数论
---

对 $k\ge1$ 及正整数 $n$，由 $\gcd(i,j)^k=\sum_{d\mid\gcd(i,j)}J_k(d)$，可转成整除计数：


$$
\boxed{\sum_{1\le i,j\le n}\gcd(i,j)^k=\sum_{d=1}^nJ_k(d)\left\lfloor\frac nd\right\rfloor^2.}
$$


对 $r,s\ge1$、$n\ge1$，Jordan 函数还满足卷积关系


$$
\boxed{J_{r+s}(n)=\sum_{d\mid n}d^sJ_r(d)J_s(n/d).}
$$


按 $\max(i,j)$ 分层的一条**加权互质对**求和恒等式为


$$
\boxed{\sum_{\substack{1\le i,j\le n\\\gcd(i,j)=1}}ij=\sum_{k=1}^nk^2\varphi(k).}
$$


另一条适用于任意数值函数 $f,g$ 且和式均有限的换序恒等式：


$$
\sum_{i=1}^nf(i)\sum_{j=1}^{\lfloor n/i\rfloor}g(j)=\sum_{j=1}^ng(j)\sum_{i=1}^{\lfloor n/j\rfloor}f(i).
$$


最后一个换序恒等式左右两边均在枚举所有满足 $ij\le n$ 的有序整数对。与 5.5 的无权 gcd 反演配合使用。
