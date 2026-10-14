---
kind: algorithm
title: 三维旋转：Rodrigues 公式
updated: 2026-10-12
status: draft
order: 1081400
tags:
  - 立体几何
---

单位旋转轴 $u\in\mathbb R^3$，遵循右手定则绕轴旋转角度 $\theta$，任意向量 $v$ 旋转结果：


$$
\boxed{R_u(\theta)v=v\cos\theta+(u\times v)\sin\theta+u(u\cdot v)(1-\cos\theta).}
$$


矩阵形式 $R_u=cI+(1-c)uu^{\mathsf T}+s[u]_\times$，其中 $c=\cos\theta,s=\sin\theta$，$[u]_\times v=u\times v$。一般坐标轴穿过 $p_0$ 时点 $p$ 的新坐标为 $p_0+R_u(\theta)(p-p_0)$。若旋转轴向量未单位化，须先除以长度。
