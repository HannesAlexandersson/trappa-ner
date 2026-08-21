import { supabase } from "@/utils/supabase";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function ForumScreen() {
  useEffect(() => {
    const testForumPolicys = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("forum_replies")
        .insert({
          thread_id: "5fbaeeaf-7bd3-4f7e-9eaa-31394f4c96b4",
          author_id: user.id,
          body: "This is a test reply.",
        })
        .select()
        .single();

      console.log(data);
      console.error(error);
    }
    testForumPolicys();
  }, [])


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Forum</Text>
    </View>
  );
}
