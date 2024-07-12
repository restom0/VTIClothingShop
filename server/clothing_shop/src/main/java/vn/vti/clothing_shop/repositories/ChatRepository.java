package vn.vti.clothing_shop.repositories;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.vti.clothing_shop.entities.Chat;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat,Long> {
    @Override
    @Query("SELECT c FROM Chat c WHERE c.deleted_at IS NULL")
    @NotNull
    List<Chat> findAll();
    @Query("SELECT c FROM Chat c WHERE c.sender_id = ?1 AND c.deleted_at IS NULL")
    List<Chat> findBySenderId(Long sender_id);
}