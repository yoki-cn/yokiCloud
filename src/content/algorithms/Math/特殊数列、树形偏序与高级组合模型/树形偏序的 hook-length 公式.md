---
kind: algorithm
title: 树形偏序的 hook-length 公式
updated: 2026-10-12
status: draft
order: 1090500
tags:
  - 组合数学
  - 特殊数列
---

给定一个固定的有根树形状（顶点位置可区分），在各顶点填入 $1,\ldots,n$，并要求每个祖先的标签小于其所有后代，则合法标号数


$$
\#\text{拓扑序}=\frac{n!}{\prod_{v\in V}\operatorname{size}(v)},
$$


$\operatorname{size}(v)$ 是根向下的包含自身的子树大小。有根森林同样成立；若顶点作为无标号同构结构无法区别，需要再处理自同构，不能直接用树形 hook 得无标号个数。
