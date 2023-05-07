package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

<<<<<<< HEAD
    @Query("SELECT lh.name " +
            "FROM User lh " +
            "WHERE lh.userId = :userId")
    String findNameById(Long userId);

    User getUser(long userId);
=======
    User getUser(Long userId);
>>>>>>> 6556907b ([BE] FIX: user 모듈 자료형 변경 #1038)

    Optional<User> findByName(String name);
}
