---
kind: algorithm
title: Hall、König、Gale–Ryser 与 Landau
updated: 2026-10-12
status: draft
order: 1011500
tags:
  - 组合数学
  - 计数
---

**Hall 婚配定理**：二分图左部 $L$ 可全部匹配当且仅当


$$
|N(S)|\ge|S|\qquad(\forall S\subseteq L).
$$


任意二分图 $\nu(G)=\tau(G)$，其中 $\nu$ 是最大匹配数、$\tau$ 是最小顶点覆盖数（König）；无孤立点时最小边覆盖数为 $|V|-\nu(G)$。

**Gale–Ryser**：非增的非负整数行度 $r_1\ge\cdots\ge r_m$ 与列度 $c_1,\dots,c_n$ 可作为简单二分图度序列当且仅当


$$
\sum_i r_i=\sum_j c_j,\qquad \sum_{i=1}^k r_i\le\sum_{j=1}^n\min(k,c_j)\quad(1\le k\le m).
$$


**竞赛图得分序列（Landau）**：将各点出度排成非降序 $s_1\le\cdots\le s_n$，则存在相应竞赛图当且仅当


$$
\sum_{i=1}^ns_i=\binom n2,\qquad\sum_{i=1}^ks_i\ge\binom k2\quad(1\le k<n).
$$
