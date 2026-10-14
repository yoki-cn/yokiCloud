---
kind: algorithm
title: 整除、gcd 与 Bézout
updated: 2026-10-12
status: draft
order: 1050100
tags:
  - 数论
---

对于整数 $a,b$，$\gcd(a,b)$ 定义为非负，$\gcd(0,0)=0$；$\operatorname{lcm}(a,b)$ 取非负，零参数时为 $0$。


$$
\gcd(a,b)=\gcd(b,a\bmod b),\qquad \gcd(a,b)\operatorname{lcm}(a,b)=|ab|,
$$


$$
\gcd(a,b)=\min\{ax+by>0:x,y\in\mathbb Z\}\quad((a,b)\ne(0,0)).
$$


Bézout 定理：$ax+by=c$ 有整数解当且仅当 $\gcd(a,b)\mid c$。若 $ax_0+by_0=d=\gcd(a,b)>0$，则对 $d\mid c$：


$$
x=x_0\frac cd+\frac bd t,\quad y=y_0\frac cd-\frac ad t,\qquad t\in\mathbb Z.
$$



$$
\gcd(a_1,\ldots,a_n)=\gcd(\gcd(a_1,\ldots,a_{n-1}),a_n).
$$
