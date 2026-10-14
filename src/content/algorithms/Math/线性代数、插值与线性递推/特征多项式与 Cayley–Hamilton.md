---
kind: algorithm
title: 特征多项式与 Cayley–Hamilton
updated: 2026-10-12
status: draft
order: 1040500
tags:
  - 线性代数
  - 线性递推
---

$$
\chi_A(t)=\det(tI-A),\qquad\chi_A(A)=0.
$$


若 $\chi_A(t)=t^n+c_{n-1}t^{n-1}+\cdots+c_0$，则


$$
A^n=-c_{n-1}A^{n-1}-\cdots-c_0I.
$$


由此任意 $A^N$ 可先求 $t^N\bmod \chi_A(t)$ 再把 $t$ 代成 $A$。矩阵快速幂 $O(n^3\log N)$（朴素矩阵乘法），特征多项式降阶可在某些场景减少查询代价。
