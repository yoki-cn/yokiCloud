---
kind: algorithm
title: Prüfer 与图的握手引理、环空间
updated: 2026-10-12
status: draft
order: 1031200
tags:
  - 图论
  - 树
  - 计数
---

$$
\sum_{v\in V}\deg(v)=2|E|,\qquad \sum_v\deg^+(v)=\sum_v\deg^-(v)=|E|.
$$


无向图有 $n$ 顶点、$m$ 边、$c$ 个连通分量，其在 $\mathbb F_2$ 上的环空间维数为


$$
\dim\mathcal C=m-n+c,\qquad \#\text{偶度边集}=2^{m-n+c}.
$$


割空间维数 $n-c$，两者关于模 $2$ 内积正交。若附加奇偶约束独立且相容，每个约束使解数减半；不相容则为 $0$。
