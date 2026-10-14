---
kind: algorithm
title: 树形 Green Hackenbush
updated: 2026-10-12
status: draft
order: 1100500
tags:
  - 博弈论
---

一棵以固定根为地面的树，操作是删去任意一条边，并删除因而不再连到根的部分。记 $v$ 遍历 $u$ 的孩子：


$$
\boxed{\operatorname{sg}(u)=\bigoplus_{v\text{ 是 }u\text{ 的孩子}}\bigl(\operatorname{sg}(v)+1\bigr).}
$$


叶子的 SG 为 $0$。长度为 $h$ 的链的 SG 为 $h$，从根连出 $h$ 条叶边的星形图 SG 为 $h\bmod2$。**先各孩子加一再异或**，不可先异或再统一加一。此式依赖树形结构和“允许删除任意边”的规则。
