---
kind: algorithm
title: Perron、谱图论、矩阵幂模型
updated: 2026-10-12
status: draft
order: 1041300
tags:
  - 线性代数
  - 线性递推
---

对非负不可约矩阵 $A$，Perron–Frobenius 定理保证谱半径 $\rho(A)>0$ 是代数重数 $1$ 的特征值，并有严格正的左右特征向量。**若矩阵不可约但具周期，其他特征值模长也可等于 $\rho(A)$**；只有 primitive（本原）时才保证其他特征值严格较小。

邻接矩阵 $A$ 的 $k$ 次幂 $A^k_{uv}$ 是长度恰为 $k$ 的 $u\to v$ 游走数（可重复点边）。在 min-plus 半环上把乘加替换为加最小，可得恰长 $k$ 的最短路，空路径时对角线为 $0$，其他项为 $+\infty$。
