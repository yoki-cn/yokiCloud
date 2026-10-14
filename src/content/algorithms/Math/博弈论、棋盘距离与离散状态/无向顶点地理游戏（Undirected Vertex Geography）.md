---
kind: algorithm
title: 无向顶点地理游戏（Undirected Vertex Geography）
updated: 2026-10-12
status: draft
order: 1101300
tags:
  - 博弈论
---

在无向有限简单图中从指定顶点 $v$ 开始；双方轮流移动到一个尚未访问过的邻接顶点，无法移动者输。设 $\nu(G)$ 是最大匹配数，则


$$
\boxed{\text{先手胜}\iff \nu(G-v)=\nu(G)-1\iff v\text{ 在每一个最大匹配中都被匹配}.}
$$


若 $\nu(G-v)=\nu(G)$，说明存在最大匹配没有覆盖 $v$，先手败。结论使用的是“走到尚未访问过的顶点”的规则；若边不能复用但顶点可复用（边地理游戏），问题不同。
