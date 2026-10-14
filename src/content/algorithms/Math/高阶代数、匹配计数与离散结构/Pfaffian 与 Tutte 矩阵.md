---
kind: algorithm
title: Pfaffian 与 Tutte 矩阵
updated: 2026-10-12
status: draft
order: 1130300
tags:
  - 高阶代数
  - 图论
  - 组合数学
---

$2n\times2n$ 反对称矩阵 $A^\mathsf T=-A$，当底层域特征不为 $2$ 时，其 Pfaffian 按有符号完美配对展开：


$$
\operatorname{pf}(A)=\frac1{2^nn!}\sum_{\sigma\in S_{2n}}\operatorname{sgn}(\sigma)\prod_{i=1}^na_{\sigma(2i-1),\sigma(2i)},
$$


$$
\boxed{\det A=\operatorname{pf}(A)^2.}
$$


若给图每条边 $\{i,j\}$（$i<j$）配置独立不定元 $x_{ij}$，Tutte 矩阵 $T_{ij}=x_{ij},T_{ji}=-x_{ij}$，非边为零，则


$$
G\text{ 存在完美匹配}\iff\det T\not\equiv0\quad\text{作为多项式}.
$$


奇数阶反对称矩阵行列式为 $0$。代入随机值求秩是概率算法，在有限域上会存在误判概率，不能与多项式恒等判定混同。
