---
kind: algorithm
title: 整除分块、调和分块与 floor_sum
updated: 2026-10-12
status: draft
order: 1051300
tags:
  - 数论
---

对 $n\ge1$，$\lfloor n/i\rfloor$ 的不同值只有 $O(\sqrt n)$ 个。若 $q=\lfloor n/l\rfloor$，则最大同商右端点为


$$
r=\left\lfloor\frac nq\right\rfloor,\quad\left\lfloor\frac ni\right\rfloor=q\quad(l\le i\le r).
$$



$$
\sum_{i=1}^n\left\lfloor\frac ni\right\rfloor=\sum_{k=1}^n\tau(k),\qquad\sum_{i=1}^n\varphi(i)=\frac12\left(1+\sum_{i=1}^n\sum_{j=1}^n[\gcd(i,j)=1]\right).
$$


定义 $F(n,m,a,b)=\sum_{i=0}^{n-1}\left\lfloor\frac{ai+b}m\right\rfloor$，$n\ge0,m\ge1$，$a,b$ 可取负，先按**数学意义的向下取整**归一化 $a,b$ 模 $m$；之后用 Euclid 互换变量的递归计算，典型复杂度 $O(\log m)$。C++ 负数整数除法向零截断，不能直接代替数学 floor。
