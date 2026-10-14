---
kind: algorithm
title: Möbius 函数与 Dirichlet 卷积
updated: 2026-10-12
status: draft
order: 1050400
tags:
  - 数论
---

$$
\mu(n)=\begin{cases}1,&n=1,\\(-1)^r,&n\text{ 是 }r\text{ 个不同素数的乘积},\\0,&\exists p^2\mid n.\end{cases}
$$


算术函数卷积：


$$
(f*g)(n)=\sum_{d\mid n}f(d)g(n/d),\quad 1(n)=1,\quad\varepsilon(n)=[n=1],
$$


$$
1*\mu=\varepsilon,\quad1*\varphi=\operatorname{id},\quad \mu*\operatorname{id}=\varphi,\quad1*1=\tau.
$$


若 $F(n)=\sum_{d\mid n}f(d)$，则 $f(n)=\sum_{d\mid n}\mu(d)F(n/d)$。

对积性函数 $f$：若 $\gcd(a,b)=1$，$f(ab)=f(a)f(b)$；积性函数由其素数幂取值确定。$f(1)=1$ 适用于非零积性函数。
