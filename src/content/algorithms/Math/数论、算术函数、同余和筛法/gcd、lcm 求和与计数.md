---
kind: algorithm
title: gcd、lcm 求和与计数
updated: 2026-10-12
status: draft
order: 1050500
tags:
  - 数论
---

$$
[\gcd(a,b)=1]=\sum_{d\mid a,\,d\mid b}\mu(d),\quad \#\{1\le a\le A,1\le b\le B:\gcd(a,b)=1\}=\sum_{d\le\min(A,B)}\mu(d)\Big\lfloor\frac Ad\Big\rfloor\Big\lfloor\frac Bd\Big\rfloor.
$$


$$
\sum_{i=1}^n\gcd(i,n)=\sum_{d\mid n}d\,\varphi(n/d),
$$


$$
\sum_{1\le i,j\le n}\gcd(i,j)=\sum_{d=1}^n\varphi(d)\Big\lfloor\frac nd\Big\rfloor^2,\qquad\sum_{i=1}^n\varphi(i)=\frac12\left(1+\sum_{i=1}^n\sum_{j=1}^n[\gcd(i,j)=1]\right).
$$


**后一式核查**：左侧计数原点三角区域互质对；对 $n=1$，$\frac12(1+1)=1$，正确。一般互质对方阵数 $=2\sum_{i\le n}\varphi(i)-1$。


$$
\operatorname{lcm}(a,b)=\frac{|ab|}{\gcd(a,b)}\quad(ab\ne0),\qquad\gcd(a,b)^k=\sum_{d\mid\gcd(a,b)}J_k(d).
$$
