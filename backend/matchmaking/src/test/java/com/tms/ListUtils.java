package com.tms;

import java.util.HashSet;
import java.util.List;

public class ListUtils {
    public static <T> boolean areFirstNItemsEqual(List<T> list1, List<T> list2, int n) {
        if (list1 == null || list2 == null) {
            throw new IllegalArgumentException("Lists must not be null");
        }
        if (n < 0 || n > list1.size() || n > list2.size()) {
            throw new IllegalArgumentException("Invalid value of n");
        }
        for (int i = 0; i < n; i++) {
            if (!list1.get(i).equals(list2.get(i))) {
                return false;
            }
        }
        return true;
    }

    public static <T> boolean areMoreThanNItemsUnique(List<T> list1, int n) {
        if (list1 == null) {
            throw new IllegalArgumentException("List must not be null");
        }

        HashSet<T> set = new HashSet<>(list1);
        return set.size() > n;
    }
}