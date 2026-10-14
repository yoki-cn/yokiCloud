---
kind: algorithm
title: Lagrange、Newton 差商与重节点
updated: 2026-10-12
status: draft
order: 1040900
tags:
  - 线性代数
  - 线性递推
---

不同 $x_i$：


$$
f(x)=\sum_{i=0}^ny_i\frac{\prod_{j\ne i}(x-x_j)}{\prod_{j\ne i}(x_i-x_j)}.
$$


Newton 形式：


$$
f(x)=f[x_0]+\sum_{k=1}^n f[x_0,\ldots,x_k]\prod_{j=0}^{k-1}(x-x_j),
$$


$$
f[x_i,\ldots,x_{i+k}]=\frac{f[x_{i+1},\ldots,x_{i+k}]-f[x_i,\ldots,x_{i+k-1}]}{x_{i+k}-x_i}.
$$


重节点时须使用 Hermite 插值及导数信息，不能计算零分母的普通差商。
