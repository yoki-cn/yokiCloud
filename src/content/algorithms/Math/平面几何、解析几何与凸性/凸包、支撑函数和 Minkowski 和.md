---
kind: algorithm
title: 凸包、支撑函数和 Minkowski 和
updated: 2026-10-12
status: draft
order: 1071500
tags:
  - 平面几何
---

凸集 $K$ 的支撑函数 $h_K(u)=\max_{x\in K}u\cdot x$，则


$$
h_{K+L}(u)=h_K(u)+h_L(u),\qquad K+L=\{x+y:x\in K,y\in L\}.
$$


凸包面积可由有向边累加；两个 CCW 凸多边形的 Minkowski 和边向量可按极角合并，顶点数至多 $n+m$（去掉共线与重复后）。对两个点集 $A,B$，最大欧氏距离可由 $\operatorname{conv}(A)+(-\operatorname{conv}(B))$ 的最远点范数求得。
