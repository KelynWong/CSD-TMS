package com.tms.matchmaking;


import lombok.Data;


@Data
public class TreeNode {
    private Long id;
    private TreeNode left;
    private TreeNode right;

    public TreeNode(Long id) {
        this.id = id;
    }
}
