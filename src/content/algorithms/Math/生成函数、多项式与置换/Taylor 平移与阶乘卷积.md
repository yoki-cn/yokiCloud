---
kind: algorithm
title: Taylor 平移与阶乘卷积
updated: 2026-10-12
status: draft
order: 1021200
tags:
  - 生成函数
  - 多项式
  - 群论
---

设 $f(x)=\sum_{j=0}^na_jx^j$，求 $f(x+c)=\sum_{k=0}^nb_kx^k$：


$$
b_k=\sum_{j=k}^n\binom jk a_jc^{j-k}=\frac1{k!}\sum_{j=k}^n(a_jj!)\frac{c^{j-k}}{(j-k)!}.
$$


可反转 $a_jj!$ 与序列 $c^j/j!$ 做一次卷积，计算 $O(n\log n)$（需相应阶乘的模逆）。
