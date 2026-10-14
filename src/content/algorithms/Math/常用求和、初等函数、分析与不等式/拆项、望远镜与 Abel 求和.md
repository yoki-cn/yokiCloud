---
kind: algorithm
title: 拆项、望远镜与 Abel 求和
updated: 2026-10-12
status: draft
order: 1120200
tags:
  - 求和
  - 微积分
  - 不等式
---

$$
\frac1{k(k+1)}=\frac1k-\frac1{k+1},\quad\sum_{k=1}^n\frac1{k(k+1)}=\frac n{n+1},
$$


$$
\frac1{k(k+1)\cdots(k+r)}=\frac1r\left(\frac1{k\cdots(k+r-1)}-\frac1{(k+1)\cdots(k+r)}\right)\quad(r\ge1).
$$


离散分部积分（Abel 变换）。令 $A_k=\sum_{i=l}^ka_i$，则


$$
\boxed{\sum_{k=l}^ra_kb_k=A_rb_r+\sum_{k=l}^{r-1}A_k(b_k-b_{k+1}).}
$$


前缀和、部分和与单调差分的界估计可直接从此式得到。
