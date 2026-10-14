---
kind: algorithm
title: 随机 Cartesian 树、随机 BST 与 Quicksort
updated: 2026-10-12
status: draft
order: 1062200
tags:
  - 概率
  - 期望
---

对 $n$ 个互异元素赋独立同分布连续随机优先级，建最小 Cartesian 树；区间 $[i,j]$ 内最小优先级落在某个位置的概率均为 $1/(j-i+1)$。


$$
\Pr(i\text{ 是 }j\text{ 的祖先})=\frac1{|i-j|+1}\quad(i\ne j),
$$


$$
\mathbb E\operatorname{depth}(i)=H_{i+1}+H_{n-i}-2\quad(0\le i<n),
$$


$$
\mathbb E\#\text{Quicksort 比较}=2(n+1)H_n-4n.
$$


前提是随机优先级形成均匀随机排列，或每次 pivot 在子区间中均匀选择；确定的优先级或重复相等时必须重新建模。
Quicksort 公式统计的是**互异关键字、随机选 pivot、每次使用关键字比较**所产生的比较次数；若排序分区策略额外增加其他比较、处理重复关键字，不能直接套用。
