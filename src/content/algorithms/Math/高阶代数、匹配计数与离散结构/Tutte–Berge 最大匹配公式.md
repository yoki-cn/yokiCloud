---
kind: algorithm
title: Tutte–Berge 最大匹配公式
updated: 2026-10-12
status: draft
order: 1130400
tags:
  - 高阶代数
  - 图论
  - 组合数学
---

有限无向图 $G=(V,E)$，令 $o(G-S)$ 为删去顶点集 $S$ 后含奇数个顶点的连通分量数，则一般图最大匹配边数


$$
\boxed{\nu(G)=\frac12\min_{S\subseteq V}\bigl(|V|+|S|-o(G-S)\bigr).}
$$


特别地，$G$ 存在完美匹配当且仅当对每个 $S\subseteq V$ 都满足 $o(G-S)\le |S|$（Tutte 定理）。这一条件适用于一般图，Hall 是二分图中的专用等价形式。
