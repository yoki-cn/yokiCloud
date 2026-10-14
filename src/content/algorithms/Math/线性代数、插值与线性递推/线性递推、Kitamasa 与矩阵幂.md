---
kind: algorithm
title: 线性递推、Kitamasa 与矩阵幂
updated: 2026-10-12
status: draft
order: 1040700
tags:
  - 线性代数
  - 线性递推
---

$$
a_n=c_1a_{n-1}+\cdots+c_da_{n-d}\quad(n\ge d),\qquad Q(t)=t^d-c_1t^{d-1}-\cdots-c_d.
$$


若 $t^N\equiv\sum_{j=0}^{d-1}b_jt^j\pmod{Q(t)}$，则


$$
a_N=\sum_{j=0}^{d-1}b_ja_j.
$$


对伴随矩阵 $M$，$[a_{n+d-1},\ldots,a_n]^T=M^n[a_{d-1},\ldots,a_0]^T$。不能把递推特征多项式 $Q$ 与生成函数分母 $1-c_1x-\cdots-c_dx^d$ 的系数顺序混淆。
