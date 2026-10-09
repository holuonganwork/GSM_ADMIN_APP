package com.greensm.compliance.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String EXCHANGE_NAME = "gsm.exchange";
    public static final String ADMIN_REVIEWS_QUEUE = "q.admin.reviews";
    public static final String ROUTING_KEY_REVIEW_REQUESTED = "investigation.review.requested";
    public static final String ROUTING_KEY_DECISION_FINALIZED = "case.decision.finalized";

    @Bean
    public TopicExchange gsmExchange() {
        return new TopicExchange(EXCHANGE_NAME, true, false);
    }

    @Bean
    public Queue adminReviewsQueue() {
        return new Queue(ADMIN_REVIEWS_QUEUE, true);
    }

    @Bean
    public Binding adminReviewsBinding(Queue adminReviewsQueue, TopicExchange gsmExchange) {
        return BindingBuilder.bind(adminReviewsQueue).to(gsmExchange).with(ROUTING_KEY_REVIEW_REQUESTED);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
