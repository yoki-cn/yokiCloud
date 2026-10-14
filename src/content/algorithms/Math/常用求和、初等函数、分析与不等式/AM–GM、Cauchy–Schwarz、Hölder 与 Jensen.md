---
kind: algorithm
title: AM–GM、Cauchy–Schwarz、Hölder 与 Jensen
updated: 2026-10-12
status: draft
order: 1120900
tags:
  - 求和
  - 微积分
  - 不等式
---

对非负 $a_1,\ldots,a_n$：


$$
\frac1n\sum_{i=1}^na_i\ge\left(\prod_{i=1}^na_i\right)^{1/n},
$$


$$
\left(\sum_{i=1}^na_ib_i\right)^2\le\left(\sum_{i=1}^na_i^2\right)\left(\sum_{i=1}^nb_i^2\right),
$$


$$
\sum_i|a_ib_i|\le\left(\sum_i|a_i|^p\right)^{1/p}\left(\sum_i|b_i|^q\right)^{1/q},\quad p,q>1,\ \frac1p+\frac1q=1.
$$


权重 $w_i\ge0,\sum_iw_i=1$ 且 $f$ 为凸函数时，


$$
f\left(\sum_iw_ix_i\right)\le\sum_iw_if(x_i).
$$


凸函数 Jensen 不等式在随机版本中写作 $f(\mathbb EX)\le\mathbb E f(X)$（两边存在且 $X$ 处于 $f$ 的凸定义域）。凹函数方向反转。
