---
kind: algorithm
title: GF(2) 线性基、异或和空间
updated: 2026-10-12
status: draft
order: 1041100
tags:
  - 线性代数
  - 线性递推
---

对 $n$ 个 $m$ 位向量的线性基秩为 $r$，其张成的**不同 XOR 结果**恰有 $2^r$ 个，每个可表示结果被 $2^{n-r}$ 个选择子集表示。


$$
\#\{(c_1,\ldots,c_n)\in\mathbb F_2^n:\sum_i c_iv_i=t\}=\begin{cases}2^{n-r},&t\in\operatorname{span}(v_i),\\0,&\text{否则}\end{cases}
$$


零 XOR 子集总数 $2^{n-r}$（含空集）。若零向量可表示为非空子集，只有在 $n>r$ 时才存在，此时非空零 XOR 方案数为 $2^{n-r}-1$。
