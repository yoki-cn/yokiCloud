---
kind: algorithm
title: 多边形 Pick 定理和边界格点
updated: 2026-10-12
status: draft
order: 1070800
tags:
  - 平面几何
---

顶点为整数坐标的简单格点多边形，$I$ 为内部整点数、$B$ 为边界整点数：


$$
S=I+\frac B2-1,\quad B=\sum_i\gcd(|x_{i+1}-x_i|,|y_{i+1}-y_i|).
$$


若连通区域含 $h$ 个洞且每条边界为格点简单闭曲线，则


$$
S=I+\frac B2-1+h.
$$


若多边形退化成线段或存在交叉，不能机械套 Pick 定理。
