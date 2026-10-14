---
kind: algorithm
title: 行列式、逆矩阵与 Cramer 法则
updated: 2026-10-12
status: draft
order: 1040200
tags:
  - 线性代数
  - 线性递推
---

$$
\det(AB)=\det A\det B,\quad\det A^T=\det A,\quad\det(\lambda A)=\lambda^n\det A.
$$


$$
A^{-1}=\frac{\operatorname{adj}(A)}{\det A}\quad(\det A\ne0),\qquad x_i=\frac{\det A_i(b)}{\det A}\quad(Ax=b).
$$


置换展开：


$$
\det A=\sum_{\pi\in S_n}\operatorname{sgn}(\pi)\prod_{i=1}^n a_{i,\pi(i)}.
$$


域上高斯消元行列式在交换两行时变号，某行乘 $c$ 则乘 $c$，一行加另行倍数则不变。
