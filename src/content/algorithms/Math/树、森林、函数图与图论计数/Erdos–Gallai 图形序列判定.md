---
kind: algorithm
title: Erdos–Gallai 图形序列判定
updated: 2026-10-12
status: draft
order: 1031400
tags:
  - 图论
  - 树
  - 计数
---

非增非负整数 $d_1\ge\cdots\ge d_n$ 是无向简单图度序列，当且仅当总度数为偶数，且


$$
\sum_{i=1}^k d_i\le k(k-1)+\sum_{i=k+1}^n\min(d_i,k)\quad(1\le k\le n).
$$


该判定专用于简单无向图；多重图或二分图应使用相应其他判据。
