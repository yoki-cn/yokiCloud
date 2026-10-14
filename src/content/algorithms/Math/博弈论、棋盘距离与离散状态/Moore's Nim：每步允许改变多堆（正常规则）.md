---
kind: algorithm
title: Moore's Nim：每步允许改变多堆（正常规则）
updated: 2026-10-12
status: draft
order: 1101100
tags:
  - 博弈论
---

有 $n$ 个石堆，每步可选择 $1$ 到 $k$ 堆（$1\le k\le n$），从**每个被选中的堆中**各取任意正数枚，取走最后一颗者赢。把第 $j$ 位有 $1$ 的堆数记为 $b_j$，则


$$
\boxed{\text{必败}\iff b_j\equiv0\pmod{k+1}\quad\text{对每个二进制位 }j.}
$$


$k=1$ 恰是普通 Nim 的逐位 XOR 零条件；当 $k\ge n$ 且仍有非空堆时先手可以一次全部清空，所以必败态仅全空。**此处是正常规则**，不可直接套用于取完者输的变种（尤其不可混用）。
