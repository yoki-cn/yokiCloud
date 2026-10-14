---
kind: algorithm
title: 按位 AND、OR、xor、lcm 的状态差异
updated: 2026-10-12
status: draft
order: 1111000
tags:
  - 数论
  - 位运算
  - 区间统计
---

固定一端延长区间，$W$ 位非负整数的按位 AND 只会由 $1$ 变 $0$，OR 只会由 $0$ 变 $1$，因此不同连续值至多 $W+1$ 个；xor 无此性质（每位可以重复翻转）。


$$
\operatorname{xor}(a_l,\ldots,a_r)=P_r\oplus P_{l-1},\quad P_r=\bigoplus_{i=1}^r a_i.
$$



$$
\operatorname{lcm}(a,b)=\frac{|a|}{\gcd(a,b)}|b|\quad(a,b\ne0).
$$


算 lcm 前要先除 gcd 并检查乘法溢出。$\gcd,\min,\max,\operatorname{AND},\operatorname{OR}$ 是幂等聚合，可用 ST 表两个**可重叠**区间查询；xor 不幂等，不能照搬。
