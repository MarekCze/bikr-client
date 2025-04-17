-- Function to get detailed post information including author, media, counts, tags, poll data, and user interactions
-- Used by the API layer to fetch comprehensive data for displaying a single post.

-- Parameters:
--   post_id_input uuid: The ID of the post to fetch.
--   auth_user_id_input uuid DEFAULT NULL: The ID of the authenticated user making the request (optional, used for user-specific interaction flags).

-- Returns: TABLE containing a single row with the detailed post data, structured to match the DetailedPost type in shared types.

CREATE OR REPLACE FUNCTION func_get_detailed_post(
    post_id_input uuid,
    auth_user_id_input uuid DEFAULT NULL -- Nullable for unauthenticated requests
)
RETURNS TABLE (
    id uuid,
    user_id uuid,
    content text,
    location_name text,
    location_lat double precision,
    location_lng double precision,
    is_poll boolean,
    context_type text,
    context_id uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    author jsonb,
    media jsonb,
    tags jsonb,
    like_count bigint,
    comment_count bigint,
    bookmark_count bigint,
    poll_options jsonb,
    user_interaction jsonb
)
LANGUAGE plpgsql
AS $$
DECLARE
    post_record record;
    author_json jsonb;
    media_json jsonb;
    tags_json jsonb;
    poll_options_json jsonb;
    like_c bigint;
    comment_c bigint;
    bookmark_c bigint;
    user_interaction_json jsonb;
    is_liked_flag boolean := false;
    is_bookmarked_flag boolean := false;
    voted_option_id_val uuid := NULL;
BEGIN
    -- Fetch the main post record
    SELECT * INTO post_record FROM public.posts WHERE posts.id = post_id_input;

    -- If post not found, return empty
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Get Author Info
    SELECT jsonb_build_object(
        'id', p.id,
        'username', p.username,
        'display_name', p.display_name,
        'avatar_url', p.avatar_url
    ) INTO author_json
    FROM public.profiles p WHERE p.id = post_record.user_id;

    -- Get Media Info
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', m.id,
        'media_type', m.media_type,
        'media_url', m.media_url,
        'thumbnail_url', m.thumbnail_url,
        'position', m.position,
        'width', m.width,
        'height', m.height,
        'duration', m.duration
    ) ORDER BY m.position), '[]'::jsonb) INTO media_json
    FROM public.media m WHERE m.post_id = post_record.id;

    -- Get Tags Info
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', t.id,
        'name', t.name,
        'tag_type', t.tag_type
    ) ORDER BY t.name), '[]'::jsonb) INTO tags_json
    FROM public.content_tags ct
    JOIN public.tags t ON ct.tag_id = t.id
    WHERE ct.content_id = post_record.id AND ct.content_type = 'post';

    -- Get Counts
    SELECT count(*) INTO like_c FROM public.likes WHERE content_id = post_record.id AND content_type = 'post';
    SELECT count(*) INTO comment_c FROM public.comments WHERE post_id = post_record.id;
    SELECT count(*) INTO bookmark_c FROM public.bookmarks WHERE content_id = post_record.id AND content_type = 'post';

    -- Get Poll Options and Vote Counts (if it's a poll)
    IF post_record.is_poll THEN
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
            'id', po.id,
            'option_text', po.option_text,
            'position', po.position,
            'vote_count', (SELECT count(*) FROM public.poll_votes pv WHERE pv.poll_option_id = po.id)
        ) ORDER BY po.position), '[]'::jsonb) INTO poll_options_json
        FROM public.poll_options po WHERE po.post_id = post_record.id;
    ELSE
        poll_options_json := NULL;
    END IF;

    -- Get User Interaction Status (if authenticated user provided)
    IF auth_user_id_input IS NOT NULL THEN
        SELECT EXISTS (SELECT 1 FROM public.likes WHERE content_id = post_record.id AND content_type = 'post' AND user_id = auth_user_id_input) INTO is_liked_flag;
        SELECT EXISTS (SELECT 1 FROM public.bookmarks WHERE content_id = post_record.id AND content_type = 'post' AND user_id = auth_user_id_input) INTO is_bookmarked_flag;
        IF post_record.is_poll THEN
             SELECT pv.poll_option_id INTO voted_option_id_val
             FROM public.poll_votes pv
             JOIN public.poll_options po ON pv.poll_option_id = po.id
             WHERE pv.user_id = auth_user_id_input AND po.post_id = post_record.id
             LIMIT 1;
        END IF;

        user_interaction_json := jsonb_build_object(
            'is_liked', is_liked_flag,
            'is_bookmarked', is_bookmarked_flag,
            'voted_option_id', voted_option_id_val
        );
    ELSE
        user_interaction_json := NULL;
    END IF;

    -- Return the combined data matching the table definition
    RETURN QUERY SELECT
        post_record.id,
        post_record.user_id,
        post_record.content,
        post_record.location_name,
        post_record.location_lat,
        post_record.location_lng,
        post_record.is_poll,
        post_record.context_type,
        post_record.context_id,
        post_record.created_at,
        post_record.updated_at,
        author_json,
        media_json,
        tags_json,
        like_c,
        comment_c,
        bookmark_c,
        poll_options_json,
        user_interaction_json;

END;
$$;
