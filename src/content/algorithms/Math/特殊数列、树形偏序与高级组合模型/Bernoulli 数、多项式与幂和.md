---
kind: algorithm
title: Bernoulli 数、多项式与幂和
updated: 2026-10-12
status: draft
order: 1090300
tags:
  - 组合数学
  - 特殊数列
---

统一采用 $B_1=-1/2$ 的约定：


$$
\frac t{e^t-1}=\sum_{n\ge0}B_n\frac{t^n}{n!},\quad B_0=1,B_1=-\frac12,B_2=\frac16,B_4=-\frac1{30},
$$


$$
\sum_{k=0}^n\binom{n+1}kB_k=0\quad(n\ge1),\qquad B_{2m+1}=0\quad(m\ge1).
$$


Bernoulli 多项式 $B_n(x)=\sum_{k=0}^n\binom nk B_kx^{n-k}$，Faulhaber 公式


$$
\sum_{k=0}^{N-1}k^m=\frac{B_{m+1}(N)-B_{m+1}(0)}{m+1}=\frac1{m+1}\sum_{j=0}^m\binom{m+1}j B_jN^{m+1-j}.
$$


特别地


$$
\sum_{k=1}^nk=\frac{n(n+1)}2,\quad\sum_{k=1}^nk^2=\frac{n(n+1)(2n+1)}6,\quad\sum_{k=1}^nk^3=\left(\frac{n(n+1)}2\right)^2,
$$


$$
\sum_{k=1}^nk^4=\frac{n(n+1)(2n+1)(3n^2+3n-1)}{30},
$$


$$
\sum_{k=1}^nk^5=\frac{n^2(n+1)^2(2n^2+2n-1)}{12}.
$$


模质数 $p$ 中直接通过 $B_m$ 计算要检查 $m+1$、阶乘与 Bernoulli 分母的可逆性；不能在不可逆模数下任意作分数除法。
