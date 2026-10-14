---
kind: algorithm
title: 正规幻方（Magic Square）的行列和
updated: 2026-10-12
status: draft
order: 1091300
tags:
  - 组合数学
  - 特殊数列
---

**正规幻方**为 $n\times n$ 网格，用整数 $1,2,\ldots,n^2$ 各恰好一次填充，要求每一行、每一列以及两条主对角线的元素和均相同。无论构造如何，公共和必为


$$
\boxed{M_n=\frac{1+2+\cdots+n^2}{n}=\frac{n(n^2+1)}2.}
$$


$n=1$ 有平凡解，$n=2$ 无解；对每个整数 $n\ge3$ 都存在正规幻方。这个必要行列和不能单独证明一个给定排列是幻方，还须逐条检查对角线。
