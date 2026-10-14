---
kind: algorithm
title: Berlekamp–Massey
updated: 2026-10-12
status: draft
order: 1040800
tags:
  - 线性代数
  - 线性递推
---

给定域 $K$ 中一个足够长且确实满足常系数线性递推的序列，BM 求最短连接多项式 $C(x)=1+\sum_{i=1}^dc_ix^i$，使


$$
a_n+\sum_{i=1}^dc_ia_{n-i}=0\quad(n\ge d).
$$


若真实最短递推阶数为 $d$，通常提供至少 $2d$ 个连续项以确保恢复（标准域上无退化条件的经典保证）。在环上或使用不够长的前缀时，不保证恢复真实的未来递推。
