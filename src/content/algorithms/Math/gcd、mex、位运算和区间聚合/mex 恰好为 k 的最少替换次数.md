---
kind: algorithm
title: mex 恰好为 $k$ 的最少替换次数
updated: 2026-10-12
status: draft
order: 1110800
tags:
  - 数论
  - 位运算
  - 区间统计
---

数组长 $n\ge k\ge0$，允许单次把任一元素**任意改为非负整数**。令 $u$ 为 $0,\ldots,k-1$ 中缺失的不同整数的个数，$c_k$ 为当前等于 $k$ 的位置数。则


$$
\boxed{\operatorname{min\_changes}=\max(u,c_k).}
$$


可以优先把值 $k$ 的位置改成缺失的低值，同时解决两个约束；其余多余元素改为合适值。若 $k>n$，不可能达到；若只允许加减、交换或有不同位置代价，则公式不适用。
