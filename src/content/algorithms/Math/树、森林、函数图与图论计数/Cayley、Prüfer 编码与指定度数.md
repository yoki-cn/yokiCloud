---
kind: algorithm
title: Cayley、Prüfer 编码与指定度数
updated: 2026-10-12
status: draft
order: 1030100
tags:
  - 图论
  - 树
  - 计数
---

$n$ 个**已标号**顶点的无根简单树总数（$n\ge2$）：


$$
T_n=n^{n-2},\qquad\#\text{指定根的有根树}=n^{n-2},\qquad\#\text{根可任选的有根树}=n^{n-1}.
$$


Prüfer 序列长度 $n-2$，每个标号 $v$ 出现次数等于 $\deg(v)-1$，所以 $d_i\ge1$、$\sum_i d_i=2n-2$ 时


$$
\#\{T:\deg_T(i)=d_i\}=\frac{(n-2)!}{\prod_{i=1}^n(d_i-1)!}.
$$


以固定根 $r$ 定向为向外的有根树时，根孩子数 $d_r$，其他点孩子数 $d_i-1$。若给定整个出度（孩子数）向量，则必须按根与非根区别转换为无向度数。

一棵均匀随机标号树：


$$
\Pr(\{u,v\}\in E)=\frac2n,\quad\mathbb E\#\text{叶子}=n\left(1-\frac1n\right)^{n-2}\quad(n\ge2).
$$


叶子对应 Prüfer 中未出现的标号。
