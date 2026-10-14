---
kind: algorithm
title: 常系数递推与有理 OGF
updated: 2026-10-12
status: draft
order: 1021400
tags:
  - 生成函数
  - 多项式
  - 群论
---

若 $a_n=\sum_{i=1}^dc_i a_{n-i}$（$n\ge d$），置 $Q(x)=1-\sum_{i=1}^dc_ix^i$，$A(x)=\sum a_nx^n$，则


$$
Q(x)A(x)=P(x),\qquad\deg P<d,\qquad P(x)\equiv Q(x)\sum_{i=0}^{d-1}a_ix^i\pmod{x^d}.
$$


这是 Kitamasa（多项式模特征多项式）、矩阵快速幂、Bostan–Mori 和 BM 最短递推之间的公共连接点。
