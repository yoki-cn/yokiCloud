---
kind: algorithm
title: Hafnian 与一般图完美匹配
updated: 2026-10-12
status: draft
order: 1130200
tags:
  - 高阶代数
  - 图论
  - 组合数学
---

给定 $2n\times2n$ 对称矩阵 $A=(a_{ij})$，$\mathcal M_{2n}$ 是集合 $\{1,\ldots,2n\}$ 所有无序两两配对（完美匹配）的集合。定义


$$
\boxed{\operatorname{haf}(A)=\sum_{M\in\mathcal M_{2n}}\prod_{\{i,j\}\in M}a_{ij}.}
$$


完全图权重都为 $1$ 时


$$
|\mathcal M_{2n}|=(2n-1)!!=\frac{(2n)!}{2^nn!},\qquad\operatorname{haf}(J-I)=(2n-1)!!.
$$


对于一般无向图的对称 $0/1$ 邻接矩阵，hafnian 为完美匹配数；不同于二分图的 permanent。
