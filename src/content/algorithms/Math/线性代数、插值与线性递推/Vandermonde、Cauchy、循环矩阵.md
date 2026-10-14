---
kind: algorithm
title: Vandermonde、Cauchy、循环矩阵
updated: 2026-10-12
status: draft
order: 1040300
tags:
  - 线性代数
  - 线性递推
---

$$
\det(x_i^{j-1})_{1\le i,j\le n}=\prod_{1\le i<j\le n}(x_j-x_i).
$$


$$
\det\left(\frac1{x_i+y_j}\right)_{i,j=1}^n=\frac{\prod_{i<j}(x_j-x_i)(y_j-y_i)}{\prod_{i,j}(x_i+y_j)}.
$$


分母必须非零。循环矩阵 $C=\operatorname{circ}(a_0,\ldots,a_{n-1})$ 在含 $n$ 次单位根 $\omega$ 的域上满足


$$
\det C=\prod_{k=0}^{n-1}\left(\sum_{j=0}^{n-1}a_j\omega^{jk}\right),
$$


对应约定的循环方向可能令 $\omega$ 换成 $\omega^{-1}$，但因 $k$ 遍历全集乘积不变。
