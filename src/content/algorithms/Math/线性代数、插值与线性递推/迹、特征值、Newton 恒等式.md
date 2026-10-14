---
kind: algorithm
title: 迹、特征值、Newton 恒等式
updated: 2026-10-12
status: draft
order: 1040600
tags:
  - 线性代数
  - 线性递推
---

$\operatorname{tr}(AB)=\operatorname{tr}(BA)$，$\operatorname{tr}(A^k)$ 等于各特征值 $\lambda_i^k$ 的和（按代数重数，在代数闭包中）。设 $e_0=1$，$e_k$ 是 $\lambda_i$ 的第 $k$ 基本对称多项式，$p_j=\sum_i\lambda_i^j$，则


$$
ke_k=\sum_{i=1}^k(-1)^{i-1}e_{k-i}p_i.
$$


若要模素数除以 $k$，要求 $k$ 在模数下可逆；否则可考虑无除法的 Berkowitz 算法或分数自由算法。
