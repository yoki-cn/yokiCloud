---
kind: algorithm
title: Euler 多面体公式与角缺损
updated: 2026-10-12
status: draft
order: 1081100
tags:
  - 立体几何
---

凸多面体 $V-E+F=2$；若表面是亏格 $g$ 的闭可定向二维流形，则 $V-E+F=2-2g$。

凸多面体每个顶点 $v$ 的角缺损 $\delta_v=2\pi-\sum_{f\ni v}\theta_{vf}$ 满足


$$
\sum_v\delta_v=4\pi.
$$


普通欧氏平面区域的三角剖分与空间多面体表面三角剖分计数条件不同，洞数、边界及亏格必须明确。
